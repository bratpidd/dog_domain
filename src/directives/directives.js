import Vue from "vue";
export default (
    Vue.directive('click-outside', {
        // eslint-disable-next-line no-unused-vars
        bind: function (el, binding, vnode) {
            const handler = (e) => {
                if ((!el.contains(e.target) && el !== e.target)) {
                    binding.value(e)
                }
            };
            el.clickOutsideEvent = handler;
            document.addEventListener('click', handler)
        },

        // eslint-disable-next-line no-unused-vars
        unbind: function (el, binding) {
            // Remove Event Listeners
            document.removeEventListener('click', el.clickOutsideEvent);
            el.clickOutsideEvent = null;
        }
    })
)